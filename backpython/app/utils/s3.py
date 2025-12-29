from __future__ import annotations

import base64
import os
import uuid
from typing import Optional

try:
    import boto3  # type: ignore
except Exception:
    boto3 = None


def upload_base64_to_s3(data_b64: Optional[str], key_prefix: str = "Fotos") -> Optional[str]:
    key_prefix = "Fotos"
    if not data_b64:
        return None

    if isinstance(data_b64, str) and data_b64.startswith(("http://", "https://")):
        return data_b64

    bucket = os.getenv("AWS_S3_BUCKET_NAME") or os.getenv("aws.s3.bucket-name") or os.getenv("aws_s3_bucket_name")
    region = os.getenv("AWS_S3_REGION") or os.getenv("aws.s3.region") or os.getenv("aws_s3_region")
    access_key = os.getenv("AWS_S3_ACCESS_KEY") or os.getenv("aws_s3_access_key")
    secret_key = os.getenv("AWS_S3_SECRET_KEY") or os.getenv("aws_s3_secret_key")

    faltantes = [k for k, v in {
        "bucket": bucket,
        "region": region,
        "access_key": access_key,
        "secret_key": secret_key,
    }.items() if not v]
    if faltantes:
        raise RuntimeError(f"Faltan variables de entorno S3: {', '.join(faltantes)}")

    try:
        import boto3
        from botocore.exceptions import ClientError
    except Exception as ex:
        raise RuntimeError(f"boto3 no disponible: {ex}")

    parsed = parse_base64(data_b64)

    ext = "bin"
    if "/" in parsed.content_type:
        ext = parsed.content_type.split("/", 1)[1].replace("jpeg", "jpg")

    filename = f"{uuid.uuid4().hex}.{ext}"
    key = f"{key_prefix}/{filename}"

    s3 = boto3.client(
        "s3",
        region_name=region,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
    )

    try:
        s3.put_object(
            Bucket=bucket,
            Key=key,
            Body=parsed.bytes,
            ContentType=parsed.content_type,
        )
    except ClientError as e:
        raise RuntimeError(f"Error subiendo a S3: {e}")

    return f"https://{bucket}.s3.{region}.amazonaws.com/{key}"

import base64
from dataclasses import dataclass
from typing import Optional, Tuple

@dataclass
class Base64Parsed:
    bytes: bytes
    content_type: str

def parse_base64(input_str: str) -> Base64Parsed:
    if not input_str or not str(input_str).strip():
        raise ValueError("Base64 vacío")

    s = str(input_str).strip()
    content_type = "application/octet-stream"

    # data:image/png;base64,AAAA...
    if s.startswith("data:"):
        comma = s.find(",")
        if comma < 0:
            raise ValueError("Data URL inválida (sin coma)")
        header = s[:comma]  
        s = s[comma + 1 :]

        semi = header.find(";")
        if semi > 5:
            content_type = header[5:semi]  

    s = s.replace("\n", "").replace("\r", "").strip()
    s = s.replace(" ", "+")            
    s = s.replace("-", "+").replace("_", "/")  

    mod = len(s) % 4
    if mod != 0:
        s = s + ("===="[mod:])

    decoded = base64.b64decode(s, validate=False)
    return Base64Parsed(bytes=decoded, content_type=content_type)
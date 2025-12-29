from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # app
    app_context_path: str = "/api"

    # db
    db_host: str = "localhost"
    db_port: int = 3306
    db_name: str = "ss1"
    db_user: str = "root"
    db_password: str = "root"

    # jwt
    jwt_secret: str = "change-me"
    jwt_expiration_ms: int = 900000

    # aws
    aws_s3_bucket: str | None = None
    aws_region: str | None = None
    aws_access_key: str | None = None
    aws_secret_key: str | None = None

    # mail
    mail_host: str | None = None
    mail_port: int | None = None
    mail_username: str | None = None
    mail_password: str | None = None
    mail_starttls: bool = True

settings = Settings()

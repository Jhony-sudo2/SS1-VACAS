from sqlalchemy.types import TypeDecorator
from sqlalchemy.dialects.mysql import BIT

class BitBool(TypeDecorator):
    impl = BIT(1)
    cache_ok = True

    def process_result_value(self, value, dialect):
        if value is None:
            return False
        if isinstance(value, memoryview):
            value = value.tobytes()
        if isinstance(value, (bytes, bytearray)):
            return value != b"\x00"
        return bool(value)

    def process_bind_param(self, value, dialect):
        # al guardar
        return b"\x01" if value else b"\x00"
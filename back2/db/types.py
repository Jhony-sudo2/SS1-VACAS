from sqlalchemy.types import TypeDecorator, Integer
from sqlalchemy.dialects.mysql import BIT

class IntEnumType(TypeDecorator):
    impl = Integer
    cache_ok = True

    def __init__(self, enum_class, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.enum_class = enum_class

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        # si viene Rol.ADMIN -> 0
        if isinstance(value, self.enum_class):
            return int(value)
        # si viene "0" -> 0
        if isinstance(value, str) and value.isdigit():
            return int(value)
        # si viene 0 -> 0
        if isinstance(value, int):
            return value
        # si viene "ADMIN" -> 0 (opcional)
        if isinstance(value, str):
            return int(self.enum_class[value])
        raise ValueError(f"Valor inválido para {self.enum_class.__name__}: {value}")

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return self.enum_class(int(value))
    
class BitBool(TypeDecorator):
    impl = BIT(1)
    cache_ok = True

    def process_result_value(self, value, dialect):
        if value is None:
            return False
        if isinstance(value, (bytes, bytearray)):
            return int.from_bytes(value, "big") == 1
        return bool(value)

    def process_bind_param(self, value, dialect):
        return b"\x01" if value else b"\x00"
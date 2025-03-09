import jwt
from jwt import ExpiredSignatureError, InvalidTokenError


def verify_token(token):
    try:
        payload = jwt.decode(token, 'kewyiuvalkb7983284rfjkvnmnzviuoyewqrewkjsdafhvcx3298461', algorithms=['HS256'])
        return payload['sub']
    except ExpiredSignatureError:
        return ExpiredSignatureError
    except InvalidTokenError:
        return InvalidTokenError
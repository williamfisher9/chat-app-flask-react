class ResponseMessage:
    def __init__(self, contents, status):
        self.contents = contents
        self.status = status

    def create_response_message(self):
        return {
            "contents": self.contents,
            "status": self.status
        }

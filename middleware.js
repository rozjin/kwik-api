class NotFoundError extends Error {
    constructor(message, status) {
        super(message);
        this.message = message;
        this.status = status;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NotFoundError)
        }

        this.name = "NotFoundError"
    }
}

const middleware = [
    async (req, res, next) => {
        req.url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    },

    async(req, res, next) => {
        next(new NotFoundError("Route not found", 404));
    },

    async(err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            "status": err.status,
            "data": {
                "message": err.message
            }
        });
    }
]

export default middleware;
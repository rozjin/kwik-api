export const get = async(req, res) => {
    return res.json({
        status: "success",
        data: {
            message: "Dummy callback url"
        }
    })
}
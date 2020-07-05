const fs = require('fs')

exports.addVisualRegressionTrackerPlugin = function (on, config) {
    on('task', {
        ["ENCODE_IMAGE"]: (props) => {
            const { imagePath } = props;
            const buffer = fs.readFileSync(imagePath)
            const imageBase64 = buffer.toString('base64')
            fs.unlinkSync(imagePath)
            return imageBase64;
        },
    })
}
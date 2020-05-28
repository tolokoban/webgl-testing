export default {
    loadImage,
    loadJson,
    loadText
}


function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => {
            console.error("Unable to load image from URL:", url)
            reject(url)
        }
        img.src = url
    })
}


async function loadText(url: string): Promise<string> {
    try {
        const request = await fetch(url)
        const text = await request.text()
        return text
    } catch (ex) {
        console.error("Unable to load text from URL:", url)
        console.error(ex)
        throw ex
    }
}


async function loadJson(url: string): Promise<{ [key: string]: any }> {
    const text = await loadText(url)
    try {
        return JSON.parse(text)
    } catch (ex) {
        console.error("Unable to parse JSON:", url)
        console.error(ex)
        throw ex
    }
}

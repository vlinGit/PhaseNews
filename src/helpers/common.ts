const parseArticle = (articleData, assets) => {
    const fields = articleData.fields
    var newArticle = {
        id: articleData.sys.id,
        thumbnailUrl: "",   
        title: fields.entryName,
        body: "",
        date: articleData.sys.updatedAt.split('T')[0],
    }

    for (var i = 0; i < fields.article.content.length; i++){
        const data = fields.article.content[i]
        if(data.nodeType === 'paragraph'){
            const contents = data.content

            var tempBody = ""
            for (var j = 0; j < contents.length; j++){
                if (contents[j].nodeType === 'text'){
                    if (contents[j].value.includes('iframe')) continue;
                    tempBody += `${contents[j].value}`
                }else if (contents[j].nodeType === 'hyperlink'){
                    tempBody += contents[j].content[0].value
                }
            }
            newArticle.body += `<p>${tempBody}</p>`
        }

        try{
            newArticle.thumbnailUrl = assets[fields.thumbnail.sys.id].url
        }catch(error){
            console.log("No thumbnail found")
        }
    }
    
    return newArticle
}

const parseAssets = (includes) => {
    var assets = {}

    if (!includes){
        return {}
    }

    for (var i = 0; i < includes.Asset.length; i++){
        const asset = includes.Asset[i]
        assets[asset.sys.id] = {
            url: asset.fields.file.url,
            contentType: asset.fields.file.contentType
        }
    }

    return assets
}

export const getArticles = (client, limit, skip) => {
    var articles = []
    return new Promise((resolve) => {
        client.getEntries({limit: limit, skip: skip})
            .then((res) => {
                if (res.items.length == 0){
                    resolve([])
                }

                const assets = parseAssets(res.includes)

                for (var i = 0; i < res.items.length; i++){
                    const item = res.items[i]
                    articles.push(parseArticle(item, assets))
                }
                resolve(articles)
            })
            .catch((error) => {
                console.error(error)
                resolve([])
            })
        }
    )
}
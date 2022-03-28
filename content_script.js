console.log("APA Generator loaded successfully!")
/*
JOURNAL src: https://www.citationmachine.net/apa/cite-a-journal

Format:
Author Last name, First initial. Middle initial. (Year Published). Title of article. Title of Periodical, Volume(Issue), page range. https://doi.org/xxxx or URL

Exmaple:
Burnell, K. J., Coleman, P. G., & Hunt, N. (2010). Coping with traumatic memories: Second World War veterans’ experiences of social support in relation to the narrative coherence of war memories. Ageing and Society, 30(1), 57-78. https://doi.org/10.1017/S0144686X0999016X

meta:
author[] - citation_author | citation_authors
date - citation_publication_date | citation_date
title - citation_title
periodical - citation_journal_title
volume - citation_volume
issue - citation_issue
doi - citation_doi <- as: https://doi.org/XXXXXX
*/
/*
WEBSITE src: https://libguides.dixie.edu/c.php?g=57887&p=371721

Format:
Author's Last Name, First Initial. Middle Initial. (Date of Publication or Update). Title of work. Site name. Retrieved Month Day, Year, from URL from Homepage

meta:
author[] - name='article:author' | LAST RESORT: property='og:site_name'
date - name='article:published_time' | DEFAULT : n.d.
title - property='og:title'
site - property='og:site_name'
retrived - https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript?rq=1
url - property='og:url'

YouTube src https://apastyle.apa.org/style-grammar-guidelines/references/examples/youtube-references
*/
function getData(possible_names){
    let data = ""
    for(let i = 0; i < possible_names.length; i++){
        try{ data = document.querySelector(`[${possible_names[i]}]`).content }
        catch{}
        if(data.length > 0){
            return data;
        }
    }
    return "Unknown"
}
function getDataList(possible_names){
    let data = []
    for(let i = 0; i < possible_names.length; i++){
        try{ data = document.querySelectorAll(`[${possible_names[i]}]`) }
        catch{}
        if(data.length > 0){
            if (possible_names[i] === "name='citation_author'") return formatAuthorsSet(data)
            else if (possible_names[i] === "name='citation_authors'") return formatAuthorsList(data[0])
            return data[0].content; // For articles, no formatting is applied
        }
    }
    return "Unknown"
}
function formatAuthorsSet(authors){
    let formattedAuthors = []
    try{
        for(let author of authors){
            let nameSplit = author.content.split(" ")
            let lastName = nameSplit.pop()//Owen Daniel Valenzuela => Valenzuela, Owen Daniel
            lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase() //'V' + 'alenzuela'
            nameSplit.unshift(lastName + ",")
            for(let i = 1; i < nameSplit.length; i++){ // Valenzuela, Owen Daniel => Valenzuela, O. D.
                nameSplit[i] = nameSplit[i][0] + "."
            }
            formattedAuthors.push(nameSplit.join(" "))
        }
    } catch{}
    return listAuthors(formattedAuthors)
}
function formatAuthorsList(authors){ //["Valenzuela OD; Lustig RH;"]
    let formattedAuthors = []
    let authorsSplit = authors.content.split(";") // "Valenzuela OD"; "Lustig RH";
    for(let author of authorsSplit){
        let nameSplit = author.split(" ") // "Valenzuela" "OD"
        let initials = nameSplit.pop() // "OD"
        initials = initials.split("").join(".") + "." // OD-> O.D.
        nameSplit.push(initials) // ["Valenzula", "O.D."]
        formattedAuthors.push(nameSplit.join(", "))
    }
    formattedAuthors.pop() // Last element is a "."
    return listAuthors(formattedAuthors)
}
function listAuthors(authors){
    let authorsList = ""
    for(let i = 0; i < authors.length; i++){
        if(i === 0){
            authorsList += authors[i]
        }
        else if(i < authors.length - 1){
            authorsList += `, ${authors[i]}`
        }
        else{
            authorsList += ` & ${authors[i]}`
        }
    }
    return authorsList
}
function getYouTubeChannel(){
    let data = ""
    try{ data = document.querySelector("[itemprop='author'] >[itemprop='name']").getAttribute("content") }
    catch { return "" }
    return data
}

chrome.runtime.onMessage.addListener(gotMsg);
function gotMsg(msg, sender, sendResponse){
    console.log(msg)
    let authors = getDataList(["name='citation_author'", "name='citation_authors'", "name='article:author'"]);
    let date = getData(["name='citation_date'", "name='citation_publication_date'", "name='article:published_time'", "itemprop='datePublished'"])
    date = date === "Unknown" ? "n.d." : date
    let title = getData(["name='citation_title'", "property='og:title'"])
    let journalOrSite = getData(["name='citation_journal_title'", "property='og:site_name'"])
    let volume = getData(["name='citation_volume'"])
    let issue = getData(["name='citation_issue'"])
    let doi = getData(["name='citation_doi'"])
    let url = getData(["property='og:url'"])
    let type = "Website"
    //Journal, Website or YouTube?
    if(journalOrSite === "YouTube"){
        type = "YouTube"
        authors = getYouTubeChannel()
    }
    else if(doi !== "Unknown"){
        type = "Journal"
    }

    let data = {
        type: type,
        authors: authors,
        date: date,
        title: title,
        periodical: journalOrSite,
        volume: volume,
        issue: issue,
        doi: doi,
        url: url
    }
    console.log(JSON.stringify(data))
    sendResponse(JSON.stringify(data))
}

/*
https://pubmed.ncbi.nlm.nih.gov/26376619/
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6088226/
https://www.cambridge.org/core/journals/ageing-and-society/article/abs/coping-with-traumatic-memories-second-world-war-veterans-experiences-of-social-support-in-relation-to-the-narrative-coherence-of-war-memories/2F6586429F2FA12083413D8F84BE3AC1
https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0057873
https://onlinelibrary.wiley.com/doi/full/10.1038/oby.2011.142
https://pubmed.ncbi.nlm.nih.gov/27346646/
https://esajournals.onlinelibrary.wiley.com/doi/abs/10.2307/1942461

https://my.clevelandclinic.org/health/articles/15416-carbohydrates
https://www.medicalnewstoday.com/articles/325171

https://www.youtube.com/watch?v=kP-UmHrxCYk&ab_channel=TheCodingTrain
*/
console.log("Pop up Script!")
let data
const contentType = document.getElementById("content-type")
const dataContent = document.getElementById("data-content")
const citationTxt = document.getElementById("citation-txt")
citationTxt.oninput = resizeTextarea
// Labels and Inputs
const lbTitle = document.getElementById("lb-title")
const inTitle = document.getElementById("in-title")
const lbAuthor = document.getElementById("lb-author")
const inAuthor = document.getElementById("in-author")
const lbDate = document.getElementById("lb-date")
const inDate = document.getElementById("in-date")
const lbJournal = document.getElementById("lb-journal")
const inJournal = document.getElementById("in-journal")
const lbVolume = document.getElementById("lb-volume")
const inVolume = document.getElementById("in-volume")
const lbIssue = document.getElementById("lb-issue")
const inIssue = document.getElementById("in-issue")
const lbDoi = document.getElementById("lb-doi")
const inDoi = document.getElementById("in-doi")
const lbUrl = document.getElementById("lb-url")
const inUrl = document.getElementById("in-url")
const btnCopy = document.getElementById("btn-copy")
btnCopy.onclick = function(){
    navigator.clipboard.writeText(citationTxt.value)
    btnCopy.innerText = "Copied!"
}
// Pop up Data Request
chrome.tabs.query({active: true, currentWindow: true}, function(tab){
    chrome.tabs.sendMessage(tab[0].id, "APA Generator: pop up data request", function(response){
        data = JSON.parse(response)        
        //Data examples for offline testing
        //data = JSON.parse(`{"type":"Journal","authors":["Thomas, E. L.","Parkinson, J. R.","Frost, G. S.","Goldstone, A. P.","Doré, C. J.","Mccarthy, J. P.","Collins, A. L.","Fitzpatrick, J. A.","Durighel, G.","Taylor-robinson, S. D.","Bell, J. D."],"date":"2012/01/01","title":"The Missing Risk: MRI and MRS Phenotyping of Abdominal Adiposity and Ectopic Fat","periodical":"Obesity","volume":"20","issue":"1","doi":"10.1038/oby.2011.142","url":"https://onlinelibrary.wiley.com/doi/10.1038/oby.2011.142"}`)
        //data = JSON.parse(`{"type":"YouTube","authors":"The Coding Train","date":"2017-11-22","title":"11.6: Chrome Extensions: Pop-ups Messaging - Programming with Text","periodical":"YouTube","volume":"Unknown","issue":"Unknown","doi":"Unknown","url":"https://www.youtube.com/watch?v=kP-UmHrxCYk"}`)
        //data = JSON.parse(`{"type":"Website","authors":[],"date":"n.d.","title":"Carbohydrates: Types & Health Benefits","periodical":"Cleveland Clinic","volume":"Unknown","issue":"Unknown","doi":"Unknown","url":"https://my.clevelandclinic.org/health/articles/15416-carbohydrates"}`)
        //data = JSON.parse(`{"type":"Website","authors":["Kandola, A."],"date":"2019-05-14T17:00:00.000Z","title":"Simple carbs vs. complex carbs: What's the difference?","periodical":"Unknown","volume":"Unknown","issue":"Unknown","doi":"Unknown","url":"https://www.medicalnewstoday.com/articles/325171"}`)
        updateGui(data)
    });
});

function updateGui(data){
    inTitle.value = data.title
    inAuthor.value = data.authors
    inDate.value = data.date
    inJournal.value = data.periodical
    inVolume.value = data.volume
    inIssue.value = data.issue
    inDoi.value = data.doi
    inUrl.value = data.url

    contentType.textContent = data.type
    citationTxt.textContent = cite(data)
    resizeTextarea()
    switch(data.type){
        case "Journal":
            
            break
        case "YouTube":
            inJournal.style = "display:none"
            lbJournal.style = "display:none"
            lbVolume.style = "display:none"
            inVolume.style = "display:none"
            lbIssue.style = "display:none"
            inIssue.style = "display:none"
            lbDoi.style = "display:none"
            inDoi.style = "display:none"
            break
        case "Website":
            lbVolume.style = "display:none"
            inVolume.style = "display:none"
            lbIssue.style = "display:none"
            inIssue.style = "display:none"
            lbDoi.style = "display:none"
            inDoi.style = "display:none"
            break
    }
}

inTitle.addEventListener('keyup', updateData)
inAuthor.addEventListener('keyup', updateData) 
inDate.addEventListener('keyup', updateData) 
inJournal.addEventListener('keyup', updateData) 
inVolume.addEventListener('keyup', updateData) 
inIssue.addEventListener('keyup', updateData) 
inDoi.addEventListener('keyup', updateData) 
inUrl.addEventListener('keyup', updateData) 

function updateData(){
    data.title = inTitle.value 
    data.authors = inAuthor.value 
    data.date = inDate.value
    data.periodical = inJournal.value
    data.volume = inVolume.value
    data.issue = inIssue.value
    data.doi = inDoi.value
    data.url = inUrl.value
    citationTxt.textContent = cite(data)
    resizeTextarea()
}
function cite(data){
    let new_citation = ""
    if(data.doi !== "Unknown"){
        new_citation = `${data.authors} (${data.date}). ${data.title}. ${data.periodical}, ${data.volume}(${data.issue}). https://doi.org/${data.doi}`
    } else if(data.periodical === "YouTube"){
        new_citation = `${data.authors}. (${data.date}). ${data.title} [Video]. ${data.periodical}. ${data.url}`
    } else{
        let today = (new Date()).toString().split(' ').splice(1,3).join(' ')
        let date = data.date.length > 10 ? data.date.slice(0, 10) : data.date // TODO fix date on content script
        new_citation = data.authors === "Unknown" || data.authors.length === 0  ? `${data.periodical}. (${date}). ${data.title}. Retrieved ${today}, from ${data.url}` : `${data.authors} (${date}). ${data.title}. ${data.periodical}. Retrieved ${today}, from ${data.url}`
    }
    return new_citation
}
function resizeTextarea(){
    citationTxt.style.height = ""
    citationTxt.style.height = citationTxt.scrollHeight + "px"
}
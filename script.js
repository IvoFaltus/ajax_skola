
const url = "https://crm.skch.cz/ajax0/procedure.php"



const username = "coffe"
const password = "kafe";
  function make_base_auth(user, password) {
  return "Basic " + btoa(user + ":" + password);
}

const AUTH_HEADER = make_base_auth(username,password)


const getNames = async () => {
    const obj = {}
    const res = await fetch(`${url}?cmd=getPeopleList`,{
    method: 'GET',
    credentials: 'include',
    headers: {
      'Authorization': AUTH_HEADER
    }})



    const data = await res.json()

    for (key of Object.keys(data)) {
        obj[data[key]["ID"]] = data[key]["name"]
    }
    return obj
}

const getDrinks = async () => {
    const arr = []
    const res = await fetch(`${url}?cmd=getTypesList`,{
    method: 'GET',
    credentials: 'include',
    headers: {
      'Authorization': AUTH_HEADER
    }})
    const data = await res.json()

    for (key of Object.keys(data)) {
        arr.push(data[key]["typ"])
    }
    return arr
}

const values = {}

document.addEventListener("DOMContentLoaded", () => {

    const select = document.querySelector("#names")
    const form = document.querySelector("form")

    getNames().then(o => {
        for (key of Object.keys(o)) {
            const option = document.createElement("option")
            option.value = key
            option.textContent = o[key]
            select.appendChild(option)
        }
        if (window.sessionUser) {
            window.sessionUser.applyLastUser(select)
        }
    })

    getDrinks().then(arr => {
        const ul = document.querySelector("#drinks")

        for (let drink of arr) {
            values[drink] = 0
            
            const li = document.createElement("li")

            const nameSpan = document.createElement("span")
            nameSpan.textContent = drink

            const minus = document.createElement("button")
            minus.type = "button"
            minus.textContent = "-"

            const count = document.createElement("span")
            count.textContent = " 0 "

            const plus = document.createElement("button")
            plus.type = "button"
            plus.textContent = "+"

            plus.addEventListener("click", () => {
                values[drink]++
                count.textContent = ` ${values[drink]} `
            })

            minus.addEventListener("click", () => {
                if (values[drink] > 0) {
                    values[drink]--
                    count.textContent = ` ${values[drink]} `
                }
            })

            li.appendChild(nameSpan)
            li.appendChild(minus)
            li.appendChild(count)
            li.appendChild(plus)

            ul.appendChild(li)
        }
    })

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const payload = {
            user: select.value,
            drinks: Object.keys(values).map(drink => ({
                type: drink,
                value: values[drink]
            }))
        }



        try {
            if (window.sessionUser ) {
                window.sessionUser.saveLastUser(select.value)
            }
            const res = await fetch(`${url}?cmd=saveDrinks`, {
                method: "POST",
                headers: {
                    "Authorization" :AUTH_HEADER,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })

            const data = await res.json()
            console.log(data)
        } catch (err) {
            console.error("Submit failed:", err)
        }
        location.reload()




    })

})



export default function optimize(data: any, permission:boolean){
    let links = firstOpt(data.links)
    if(permission) links = secondOpt(links)
    return {...data, links}
}


function firstOpt(links: any){
    let solution:any = {}
    links.forEach((link: any)=>{
        let key = `${link.source}-${link.target}`
        if(solution[key]) solution[key] += link.amount
        else solution[key] = link.amount
    })

    for(let key of Object.keys(solution)){
        if(!solution[key]) continue;
        let opposite = key.split('-').reverse().join('-')
        if(!solution[opposite]) continue;
        let amount = solution[key] - solution[opposite]
        if(amount < 0) {
            delete solution[key]
            solution[opposite] = -amount
        }
        else {
            delete solution[opposite]
            solution[key] = amount
        }
    }
    return Object.keys(solution).reduce((acc:any, curr)=>{
        let [source, target] = curr.split('-')
        return [
            ...acc,
            {source: Number(source), target: Number(target), amount: solution[curr]}
        ]
    }, [])
}

function secondOpt(links: any){
    let sums:any = {}
    links.forEach((link: any)=>{
        sums[link.source] = (sums[link.source] || 0) + link.amount
        sums[link.target] = (sums[link.target] || 0) - link.amount
    })
    sums = Object.keys(sums).reduce((acc: any, curr)=>{
        if(sums[curr] === 0) return acc
        return [...acc, {id: Number(curr), amount: sums[curr]}]
    }, [])

    let transaction: any = [];

    let i = 0
    while(sums.length > 0){
        sums = sums.sort((a: any, b: any)=>b.amount - a.amount)
        let sourceAmount = sums[0].amount;
        let targetAmount = sums[sums.length -1].amount
        if(Math.abs(sourceAmount) > Math.abs(targetAmount)){
            sums[0].amount = sourceAmount + targetAmount
            transaction.push({
                source: sums[0].id,
                target: sums[sums.length -1].id,
                amount: Math.abs(targetAmount)
            })
            sums.pop()
        }else if(Math.abs(targetAmount) > Math.abs(sourceAmount)){
            sums[sums.length -1].amount = targetAmount + sourceAmount
            transaction.push({
                source: sums[0].id,
                target: sums[sums.length -1].id,
                amount: Math.abs(sourceAmount)
            })
            sums.shift()
        }
        else if(Math.abs(targetAmount) === Math.abs(sourceAmount)){
            transaction.push({
                source: sums[0].id,
                target: sums[sums.length -1].id,
                amount: Math.abs(sourceAmount)
            })
            sums.shift()
            sums.pop()
        }
        i++
    }

    return transaction
}
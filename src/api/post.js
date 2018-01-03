import fetch from 'isomorphic-fetch'

export default function post(url,data){
    return fetch(url,{
      method:'POST',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json'
        },
        body:data    
    })
}
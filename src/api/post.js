import fetch from 'isomorphic-fetch'
import axios from 'axios'


export default function post(url,param){
  return axios.post(url,param)
}
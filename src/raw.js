import { isBrowser, getDocument } from './utils'
import { mapper } from './mapping'




const defaultVisualOptions = {
  width: 500,
  height: 500,
  background: '#FFFFFF',
}


class RAWBase {
  constructor(visualModel, data, mapping, visualOptions){
    this._visualModel = visualModel
    this._data = data
    this._mapping = mapping
    this._visualOptions = visualOptions
  }

  data(_data){
    if(!arguments.length){ return this._data}
    // # TODO VALIDATE data
    return new RAWBase(this._visualModel, _data, this._mapping, this._visualOptions)
  }


  getContainer(){
    const document = getDocument()
    const container = document.createElement('svg')
    const options  = {
      ...defaultVisualOptions,
      ...this._visualOptions,
    }
    container.setAttribute('width', options.width)
    container.setAttribute('height', options.height)
    container.style['background-color'] = options.background
    return container

  }

  mapData(){
    const mapRow = function(r){
      let o = {}
      Object.keys(this._mapping).forEach(key => {
        o[key] = row[mapping[key]]
      })

    } 
    const data = this._data || []
    return data.map(mapRow)
  }

  renderToDOM(node){

    const container = this.getContainer()
    const vizData = this.mapData()
    this._visualModel.render(container, vizData, this._visualOptions)
    node.innerHTML = ""
    node.appendChild(container)
    return new RAWDOM(node, this._visualModel, this._data, this._mapping, this._visualOptions)
    
  }


  //mapping



}


class RAWDOM extends RAWBase {
  constructor(node, ...args){
    super(...args)
    this._node = node
  }
}


function raw(visualModel, options = {}){
  const { data, mapping, visualOptions } = options
  return new RAWBase(visualModel, data, mapping, visualOptions)
}

export default raw
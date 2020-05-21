/**
* charts module.
* @module charts
*/

import { getDocument } from './utils'
import makeMapper from './mapping'


const defaultVisualOptions = {
  width: 500,
  height: 500,
  background: '#FFFFFF',
}


class RAWBase {

  constructor(visualModel, data, dataTypes, mapping, visualOptions){
    this._visualModel = visualModel
    this._data = data
    this._dataTypes = dataTypes
    this._mapping = mapping
    this._visualOptions = visualOptions
  }

  data(_data){
    if(!arguments.length){ return this._data}
    return new RAWBase(this._visualModel, _data, this._dataTypes, this._mapping, this._visualOptions)
  }

  dataTypes(_dataTypes){
    if(!arguments.length){ return this._dataTypes}
    return new RAWBase(this._visualModel, this._data, _dataTypes, this._mapping, this._visualOptions)
  }

  getContainer(node){
    //const document = getDocument()
    const document = node ? node.ownerDocument : getDocument()
    //#TODO: this could, in future, depend on visual model
    const container = document.createElement('svg')
    container.setAttribute("version", "1.1")
    container.setAttribute("xmlns", "http://www.w3.org/2000/svg")

    container.setAttribute('width', this._visualOptions.width)
    container.setAttribute('height', this._visualOptions.height)
    container.style['background-color'] = this._visualOptions.background
    return container
  }

  mapData(){
    //#TODO: check that data and other needed stuff is populated
    const dimensions = this._visualModel.dimensions
    const dataTypes = this._dataTypes
    const mapFunction = makeMapper(dimensions, this._mapping, dataTypes)
    return mapFunction(this._data)
  }

  renderToDOM(node){

    const container = this.getContainer(node)
    const vizData = this.mapData()
    this._visualModel.render(container, vizData, this._visualOptions, this._mapping, this._data)
    node.innerHTML = ""
    node.appendChild(container)
    return new RAWDOM(node, this._visualModel, this._data, this._mapping, this._visualOptions)
    
  }

  renderToString(){
    const container = this.getContainer()
    const vizData = this.mapData()
    this._visualModel.render(container, vizData, this._visualOptions, this._mapping, this._data)
    return container.outerHTML
  }

}


class RAWDOM extends RAWBase {
  constructor(node, ...args){
    super(...args)
    this._node = node
  }
}


function raw(visualModel, options = {}){
  const { data, dataTypes, mapping, visualOptions={}} = options
  const finalVisualOptions  = {
    ...defaultVisualOptions,
    ...visualOptions,
  }
  return new RAWBase(visualModel, data, dataTypes, mapping, finalVisualOptions)
}

export default raw
import {select} from 'd3-selection'


const testChart = {

  getDimensions : function(){
    return {

      x : {
        types: [Number, Date],
        required: true,
      },

      y : {
        types: [Number, Date],
        required: true,
      },

      size: {
        types: [Number],
      },

      color: {
        types: [Number, Date, String],
      },

      label: {
        types: [Number, Date, String],
      }


    }


  },

  render: function(node, data, options) {

    const selection = select(node)
    selection.append('g')
    
  }


}

export default testChart
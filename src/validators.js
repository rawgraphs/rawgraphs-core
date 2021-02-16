import Joi from 'joi'



const chartMetadataSchema = Joi.object({

  name: Joi.string(),
  thumbnail: Joi.string(),
  icon: Joi.string(),
  category: Joi.string(),
  description: Joi.string(),

})


const chartSchema = Joi.object({
  

})
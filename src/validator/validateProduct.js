const {z} = require('zod');

const productDto = z.object({
    title : z.string().min(3).max(100),
    desciption : z.string().min(2).max(255).optional(),
    price: z.number(),
    categoryId: z.number().int(),
}).superRefine((data,ctx)=>{
    if(data?.title?.length < 5){
        ctx.addIssue({
            path : ['title'],
            message : "Title too short for product",
            code: z.ZodIssueCode.custom,
        })
    }
})

module.exports = productDto;
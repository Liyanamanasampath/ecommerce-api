const { z } = require('zod');

const categoryDto = z.object({
    name: z.string().min(3).max(50),
}).superRefine((data, ctx) => {
    if (data?.name?.length < 5) {
        ctx.addIssue({
            path: ['name'],
            message: "Category name too short",
            code: z.ZodIssueCode.custom,
        })
    }
})

module.exports = categoryDto;
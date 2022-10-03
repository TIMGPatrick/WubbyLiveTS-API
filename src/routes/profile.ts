import express, {Request, Response} from 'express'

const Router = require('express-promise-router')

const router = new Router();

router.get('/', (req: Request, res: Response): Response => {
    return res.status(200).json({
        message: "This is the default profile page"
    })
})

router.get('/:profileId', (req: Request, res: Response): Response => {
    return res.status(200).json({message: `this is the endpoint for profile with id: ${req.params.profileId}`})
})

module.exports = router;

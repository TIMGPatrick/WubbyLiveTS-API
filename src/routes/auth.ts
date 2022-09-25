import express, {Request, Response} from 'express'

const router = express.Router();

router.get('/', (req: Request,res:Response): Response => {
    return res.status(200).send({
        message: "This is the auth page"
    });
})

module.exports = router;

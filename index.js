const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const multer = require('multer')
const fs = require('fs')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(express.urlencoded({ extended: false }))
app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', multer({ dest: 'upload/' }).single('csvFile'),  async (req, res) => {
    if(!req.file || req.file.originalname.slice(req.file.originalname.length - 4) !== '.csv'){
        fs.unlinkSync(req.file.path)
        return res.redirect('/')
    }

    let csvText = fs.readFileSync(req.file.path, 'utf-8').split('\r\n').map(line => line.split(','))
    const csvTextHeader = csvText.shift()
    fs.unlinkSync(req.file.path)

    csvText = csvText.map(col => {
        const newCol = {}
        csvTextHeader.forEach((colHeader, index) => {
            newCol[colHeader] = col[index]
        })
        return newCol
    })

    res.render('indexConverted', { converted: JSON.stringify(csvText) })
})


app.listen(PORT, () => console.log('Online'))
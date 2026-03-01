import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRoutes from './routes/userRoute.js'
import employeeRoutes from './routes/employeeRoute.js'
import attendanceRoutes from './routes/attendanceRoute.js'
import financeRoutes from './routes/financeRoute.js'

// app config
const app = express()
const port = process.env.PORT || 4000 

connectDB()

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true }));
// middleware 
app.use(express.json())
app.use(cors())
// app.use('/api/admin',adminrouter)
app.use('/api/user', userRoutes);
app.use('/api/employee', employeeRoutes)
app.use('/api/attendance', attendanceRoutes);
app.use('/api/finance', financeRoutes)
// app.use('/api/user', userrouter)

app.get('/',(req,res)=>{
    res.send('API is working')
})


app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port: ${port}`);
  });
// app.listen(port,()=>console.log('server started' , port))
// app.listen(port, "0.0.0.0", () => {
//     console.log(`Server is running on port: ${port}`);
//   });

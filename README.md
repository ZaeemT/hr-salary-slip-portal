
# HR Salary Slip Portal

A web application for the HR department to upload Excel ﬁles containing employee salary information. The application will parse the Excel ﬁle, generate individual salary slips in PDF format for each employee, and send these PDFs to the respective employees via email.

## Technologies Used

- **Frontend**: Vite + React
- **Backend**: Flask
- **Database**: MongoDB


## Demo




## Documentaion
Link: https://documenter.getpostman.com/view/38829592/2sAYkLmH4P#3e76247c-df8e-4368-b45b-9faf9f1ad579



## Run Locally

Clone the project

```bash
  git clone https://github.com/ZaeemT/hr-salary-slip-portal.git
```

Go to the project directory

```bash
  cd hr-salary-slip-portal
```

Go to client-side of the project

```bash
  cd client
```

Install client-side dependencies

```bash
  npm install
```

Start the client-side

```bash
  npm run dev
```

Similarly staying in the project directory, open another terminal to go to server-side of the project.
```bash
  cd server
```

Install server-side dependencies

```bash
  pip install -r requirements.txt
```

Start the server-side

```bash
  python3 run.py    # For ubuntu
  python run.py     # For windows
```

**NOTE:** Look at the .env.example in the server folder and client folder. Create your own .env files, which are necessary to run this project.


## Deployment

Link: https://hr-salary-slip-portal.vercel.app/

The frontend of this project is deployed on vercel while the APIs are deployed on Render, and the database on MongoDB Atlas. 

<div align="center">

## Getting started

1.[Clone the repository](INSTALLATION-INSTRUCTIONS.md#step-1-clone-the-repository)

2.[Create Your MongoDB Account and Database Cluster](INSTALLATION-INSTRUCTIONS.md#Step-2-Create-Your-MongoDB-Account-and-Database-Cluster)

3.[Edit the Environment File](INSTALLATION-INSTRUCTIONS.md#Step-3-Edit-the-Environment-File)

4.[Update MongoDB URI](INSTALLATION-INSTRUCTIONS.md#Step-4-Update-MongoDB-URI)

5.[Install Backend Dependencies](INSTALLATION-INSTRUCTIONS.md#Step-5-Install-Backend-Dependencies)

6.[Run Setup Script](INSTALLATION-INSTRUCTIONS.md#Step-6-Run-Setup-Script)

7.[Run the Backend Server](INSTALLATION-INSTRUCTIONS.md#Step-7-Run-the-Backend-Server)

8.[Install Frontend Dependencies](INSTALLATION-INSTRUCTIONS.md#Step-8-Install-Frontend-Dependencies)

9.[Run the Frontend Server](INSTALLATION-INSTRUCTIONS.md#Step-9-Run-the-Frontend-Server)

## Docker Compose for local development

- setup additional env variables, if necessary in the below file

```bash
docker-compose.yml
```

- After the necessary configurations run below command :

```bash
docker-compose up -d
```

This will build the images and bring up the containers for frontend, backend and mongodb.

**_NOTE:_** This docker-compose setup is associated for local development only.

# safe-zone

This readme is your step-by-step guide for using SonarQube in our project. We cover key aspects like getting it to work, integrating with GitHub, understanding how SonarQube functions, ensuring security, and maintaining code quality standards.

### Accessing SonarQube Web Interface

To access the SonarQube web interface, navigate to the following URL: [SonarQube](http://159.89.21.149:9000/). The SonarQube instance is hosted remotely on a DigitalOcean droplet. Use the following login credentials:

- **Username:** admin
- **Password:** dadmin

This will grant you access to the SonarQube dashboard, allowing you to explore and manage code quality and security analyses from our project.

## Integration with GitHub
Code analysis are being triggered on every push to our project's repository.

We recommend using the GitHub App for this purpose. Follow these steps:

1. Open the GitHub Desktop app on your computer.
2. Log in with the user 'opcauditor.'
3. Choose the private repository **danilocangucu/safe-zone** and open it with your preferred IDE.
4. Make any change to a file, such as updating this readme.
5. In GitHub Desktop, write a commit message and click the **"commit to main" button**.
6. Click on **push to main**.
7. A new build is being initiated in Jenkins. If you want to check it navigate to [https://134.209.244.117:8443/](https://134.209.244.117:8443/) in your browser. Use the following credentials to log in: **Username:** test / **Password:** test. Choose the job "sonarqube".
8. Once the build concludes, review the analysis results in SonarQube.

Alternatively, if you prefer not to use the GitHub app, access the repository **danilocangucu/safe-zone** with the following credentials:

- **Login:** opcauditor
- **Password:** audit01234

## Running with Docker

SonarQube is seamlessly running from Docker on our DigitalOcean droplet. To restart the image, follow these steps using your DigitalOcean credentials:

- **Login:** danr0x@gmail.com
- **Password:** opcopc2024

1. Click on the project "sonarqube" and select the sonarqube droplet.
2. Go to "Access" and, in the droplet console, input "root" in the "Login as..." text box.
3. Click "Launch Droplet Console." Upon connecting to the droplet, access the screen where SonarQube is running using the command: `screen -r 2083.pts-0.sonarqube`. This will open the commented screen displaying SonarQube logs.
4. To stop the Docker image, press `Ctrl+C`. Observe the information indicating SonarQube shutdown. Once you see the log "SonarQube is stopped," execute the command to run the Docker image: `docker run -p 9000:9000 -v /var/docker_volumes/sonarqube_data:/opt/sonarqube/data sonarqube:latest`.
5. Upon seeing the log "SonarQube is operational," you can access SonarQube using the previously mentioned URL.
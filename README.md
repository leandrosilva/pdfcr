# pdfcr

Node.js **Azure Functions** app to convert HTML to PDF using **chrome headless**.

    git clone https://github.com/leandrosilva/pdfcr.git
    cd pdfcr
    docker build -f Dockerfile -t pdfcr .
    docker run -p 8080:80 --name pdfcr_dev pdfcr

Head over to your Chrome or whatnot and fire:

    http://yourdockerhost:8080/api/converter?page=http://google.com

Or maybe you want to try it on my own test instance:

    https://pdfcrapp.azurewebsites.net/api/converter?page=http://google.com

That's it.
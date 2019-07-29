# Docker class notes
Docker is a flexible wrapper around many types of applications. DBs, web servers, and others. It is supposed to make composing all these easy. And to make running code in N environments easy. It also is more efficient than vms since it doesnt need a whole OS. It just uses the host OS.

## Set up
- Install docker client and open
- Create docker account and log in on the docker client
- or use `docker login` to log in

## Running
Download an image
```
docker pull nginx
```

Or just try to run the image and it will be auto downloaded
```
docker run -it -p 80:80 nginx
```

`docker run`    run the server
`-it`           interactive mode or `-d` for detached mode
`-p 80:80`      map internal port 80 to external port 80
                `<localhost port>:<internal docker port>`
`nginx`         the name of the image that we want to run


Verify its running by going to `localhost:80`. You will see the default Nginx page.

Also verify by running
```
docker ps # ps stands for "process status"
```

To also list stopped containers, run
```
docker ps -a
```

### Detached mode
`-d` instead of `-it` for detached mode
```
docker run -d -p 80:80 nginx
```

## Remove a container
Stop it
```
docker stop 5d9d4ad88923
```

Remove it
```
docker rm 5d9d4ad88923
```

This wont remove the image. View downloaded images can be seen like so:
```
docker images
```

Remove the image
```
docker image rm e445ab08b2be
```

## Naming a container
```
docker run -d -p 80:80 --name tutorial-nginx-01 nginx
```

Then you can stop it with
```
docker stop tutorial-nginx-01
```

or restart it with
```
docker start tutorial-nginx-01
```

## Interact with running container
Run bash within the container
```
docker exec -it tutorial-nginx-01 bash
```

then you can do stuff in the container
```
cd /usr/share/nginx/html
cat index.html
```

### Put our own content into the container
We can use "volumes" to connect files from outside the container into the continer. We will "mount" the volume on our locally machine into the target folder.

I've made a file called `Desktop/docker-volume/index.html` on my desktop. We will move it to the container.

```
docker run -d -p 80:80 -v ~/Desktop/docker-volume/:/usr/share/nginx/html --name tutorial-nginx-01 nginx
```

Now `/Desktop/docker-volume/` is placed in `/usr/share/nginx/html`


## Build our own custom docker images with Dockerfile
### Build custom image
Create a `Dockerfile` next to the index.html file.

```
FROM nginx # declare the image to use
COPY html /usr/share/nginx/html # declare the files to copy to the server
```

The start the container

```
docker build -t custom-image-1 .
```

`docker build`                The build command
`-t custom-image-1`    Name the image
`.`                           location of the folder to build a custom image

### Running custom image
```
docker run --name my-nginx -p 80:80 -d custom-image-1
```

## Upload to Dockerhub
First tag the image
```
docker tag custom-image-1 YOU_USERNAME/custom-image-1
```

Push to dockerhub
```
docker push YOU_USERNAME/custom-image-1
```

Push a new tag like so
```
docker push dynamojim/custom-image-1:tagname
```

## Services
*Based off of https://www.youtube.com/watch?v=hS-czwYyTpo*

You can combine or connect multiple docker images. Say, a db and a web server.

For this we will use docker compose. The example will be a node application with a REST api and a database instance of mongo db as a second service.

### Docker Services
A distributed app consists of different pieces
The pieces are each call "service"
So this is the "service" of "micro-services"

You can run replicas (multiple containers) of one image to scale capacity

To define, we will create a `docker-compose.yml` file then excecute with the `docker-compose` command.

### Set up
The following steps have been included in the repo
1) Set up an express server in JS. (Included in Repo)
2) Set up a `Dockerfile` for the JS server
3) Set up `docker-compose.yml`

## Start
In the terminal, in the project folder
```
docker-compose up
```

## List running services
In the terminal, in the project folder
```
docker-compose ps
```

## Kill running docker-compose
In the terminal, in the project folder
```
docker-compose down
```

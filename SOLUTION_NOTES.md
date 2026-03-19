1. For Authentication Middleware I recommend:
We can move the auth middleware to API Gateway service -> API Gateway can manage the authentication & authorization & routes over the apps.

2. I used a wrapper services on all 3rd parties integration (bcrypt, axios, jwt, ...) -> we can later manage & handle & replace each service from its own file without changing multi files.

3. integration between 2 services, in the current solution will be through API calls(RESTFULL APIs).


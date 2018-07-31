# Slack Random Reviewer

A slack slash command for nominating a reviewer for a code review.

##### General Form:

`/random-reviewer {list of names/slack usernames seperated by a comma or space or nothing for slack usernames} x{number of reviewers to select} for {link or extra info}`

Note: `x{number of reviewers to select}` is optional 

Note: `for` and the text following it is optional

##### Examples:

`/random-reviewer Bob John Fred`: No need to use slack usernames if you don't want to.

`/random-reviewer @Bob, @John, @Fred`: You can use slack usernames if you want them to be alerted to their nomination.

`/random-reviewer @Bob, John Fred`: You can mix and match too. Mix and match the separator (comma or space) as well if you desire.

`/rangom-reviewer Bon, John, Fred x2`: You can nominate more than one reviewer if you like.

`/random-reviewer Bob John Fred for http://link.com`: You can append a link to the review using `for`.

`/random-reviewer Bob John Fred for A super empowering review!!`: It doesn't have to be a link either.

`/random-reviewer Bob John Fred x2 for The best review today!!`: You can use the counter and `for` together.


#### Install
`npm install`

#### Running
`npm start`

#### Testing
`npm test`

#### Usage

The API expects a payload in the form
```
{ 
  "text": "{user list} x{count} for {link/info}",
  "user_id": "(Optional) ID of the slack user who used the command e.g. 'U12345'",
  "channel_id": "(Optional) ID of the slack channel the command was used in"
}
```

Try `POST http://localhost:8306/random-reviewer`
With body:

```
{ 
  "text": "User1, User2 for http://link.com"
}
```

#### AWS

There is a Swagger spec for this project in the aws directory. 

- Create a Lambda function using `index-lambda.js` as the entry point. You will also need to add `splitter.js` and `handler.js`.
- Deploy your lambda function and change the swagger `x-amazon-apigateway-integration` URI to point at your lambda.
- Change `{{api-id}}` to be the ID of your REST API.
- Import the swagger spec into API Gateway.
- Deploy your api to a stage called `prod`.
- Create a [slack slash command](https://api.slack.com/slash-commands#creating_commands) and point it at your API Gateway endpoint.
    e.g: `https://{{rest-api-id}}.execute-api.{{region}}.amazonaws.com/prod/random-reviewer`

#### Heroku

- Push this repo to Heroku (there's already a Procfile)
- Create a [slack slash command](https://api.slack.com/slash-commands#creating_commands) and point it at your Heroku endpoint.
    e.g: `https://{{app-name}}.herokuapp.com/random-reviewer`

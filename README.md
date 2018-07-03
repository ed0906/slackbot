# Slack Random Reviewer

A slack slash command for nominating a reviewer for a code review.

##### General Form:

`/random-reviewer {list of names/slack usernames seperated by a comma or space or nothing for slack usernames} for {link or extra info}`

Note: `for` and the text following it is optional

##### Examples:

`/random-reviewer Bob John Fred`: No need to use slack usernames if you dont want to.

`/random-reviewer @Bob, @John, @Fred`: You can use slack usernames if you want them to be alerted to their nomination.

`/random-reviewer @Bob, John Fred`: You can mix and match too. Mix and match the separator (comma or space) as well if you desire.

`/random-reviewer Bob John Fred for http://link.com`: You can append a link to the review using `for`

`/random-reviewer Bob John Fred for A super empowering review!!`: It doesn't have to be a link either.


#### Install
`npm install`

#### Running
`npm start`

#### Testing
`npm test`

#### Usage

Try `POST http://localhost:8306/random-reviewer`
With body:

```
{ 
  "text": "User1, User2 for http://link.com"
}
```

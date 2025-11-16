# Contributing to RoomieHub

This document outlines our team’s values, workflow, and expectations so we can collaborate effectively.

## Current Status
Currently working on sprint 2.

## Team Norms

Communication: We use Discord for updates and for discussions.

Meetings: 2-3 synchronous meetings per week based on availability to review progress and plan for the next sprint.

Accountability: Each team member is responsible for completing assigned tasks before the next sprint, and communicating when issues arise.

Conduct: Be respectful and collaborative.

Decision-Making: Decisions are made by majority vote.

## Git Workflow
Workflow: Create an new branch for each task. After testing you work and ensuring it is ready to be submitted, create a pull request and notify the rest of the team that you have made a pull request which is waiting to be reviewed. **Never** merge directly to master without having somebody review your pull request.

Review: Make sure to test all parts that were updated, as well as do a quick run through of other parts of the application to ensure nothing has been broken before accepting a pull request.

## Steps
'''
#updade local master
git checkout master
git pull origin master

#create your own working branch
git checkout -b branchname

#stage and commit
git add .
git commit -m "write a message"

#push your branch and open a PR
git push origin <branchname>
'''






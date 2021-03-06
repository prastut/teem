
'use strict';

var InvitePage = require('./../pages/invite'),
    sessionPage = require('./../pages/session'),
    Chance = require('chance'),
    projectPages = require('./../pages/project'),
    SwellRTPage = require('./../pages/swellrt'),
    invitePage = new InvitePage(),
    registerPage = new sessionPage.Register(),
    projectsPage = new projectPages.ProjectsPage(),
    projectPage = new projectPages.ProjectPage(),
    newProjectPage = new projectPages.NewProjectPage(),
    chance = new Chance(),
    swellrt = new SwellRTPage(),
    nick = chance.word();


describe('A new user', () => {
  describe('that has registered', () =>{

    beforeAll(() => {
      registerPage.get();
      registerPage.register({ nick: nick });
    });


    describe('can create a project', () => {

      beforeAll(() => {
        projectsPage.get();

        projectsPage.goToNew();

        newProjectPage.create();
      });

      describe('and invite an existing core member', () => {

        beforeAll(() => {
          invitePage.get();
          invitePage.invite('snowden');
        });

        it('the invited person should be in participant list', () => {
          expect(projectPage.getParticipants()).toContain('snowden');
        });

        it('should invite the person by email', () => {
          var inviteProjectLink = swellrt.inviteProjectLink('snowden');
          browser.getCurrentUrl().then(function(url) {
            expect(inviteProjectLink).toMatch(url.split('?')[0]);
          });
        });

      });

      describe('and invite a person by email', () => {
        var email = 'foobar@fakemail.co';
        beforeAll(() => {

          invitePage.get();
          invitePage.invite(email);
        });

        it('should invite the person by email', () => {
          var inviteProjectLink = swellrt.inviteProjectLink(email);
          browser.getCurrentUrl().then(function(url) {
            expect(inviteProjectLink).toMatch(url.split('?')[0]);
          });
        });
      });
    });
  });
});

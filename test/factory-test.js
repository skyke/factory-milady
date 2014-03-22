var Factory = require('..');
var should = require('should');
var context = describe;

describe('Factory', function() {
  var Model, Person, Job;

    before(function() {
        Model = function() {};

        Model.prototype.save = function(callback) {
            this.saveCalled = true;
            callback();
        };

        Person = function() {};
        Person.protoype = new Model();

        Job = function() {};
        Job.prototype = new Model();
    });

    beforeEach(function() {
        var nameCounter = 1;

        Factory.define('appointment', {
            where: 'Hasselt',
            when: 'tomorrow'
        });

        Factory.define('person', Person, {
              name: function(cb) { cb("person " + nameCounter++); }
            , age: 25
            , job: Factory.assoc('job')
            , title: Factory.assoc('job', 'title')
        });

        Factory.define('job', Job, {
              title: 'Engineer'
            , company: 'Foobar Inc.'
        });
    });

    describe('#build', function() {
        it('builds, but does not save the object', function(done) {
            Factory.build('job', function(job) {
                (job instanceof Job).should.be.true;
                job.title.should.eql('Engineer');
                job.company.should.eql('Foobar Inc.');
                job.should.not.have.property('saveCalled');
                done();
            });
        });

        it('passing attributes as second argument', function(done) {
            Factory.build('job', { title: "Artist", company: "Bazqux Co." }, function(job) {
                (job instanceof Job).should.be.true;
                job.title.should.eql('Artist');
                job.company.should.eql('Bazqux Co.');
                job.should.not.have.property('saveCalled');
                done();
            });
        });

        it('factory containing an association', function(done) {
            Factory.build('person', { age: 30 }, function(person) {
                (person instanceof Person).should.be.true;
                person.should.not.have.property('saveCalled');
                person.name.should.eql('person 1');
                person.age.should.eql(30);
                (person.job instanceof Job).should.be.true;
                person.job.title.should.eql('Engineer');
                person.job.company.should.eql('Foobar Inc.');
                person.job.should.have.keys('title', 'company');
                person.title.should.eql('Engineer');
                done();
            });
        });

    });

    describe('#create', function() {
        it('builds and saves the object', function(done) {
            Factory.create('job', function(err, job) {
                (job instanceof Job).should.be.true;
                job.title.should.eql('Engineer');
                job.company.should.eql('Foobar Inc.');
                job.saveCalled.should.be.true;
                done();
            });
        });

        it('passing attributes as second argument', function(done) {
            Factory.create('job', { title: "Artist", company: "Bazqux Co." }, function(err, job) {
                (job instanceof Job).should.be.true;
                job.title.should.eql('Artist');
                job.company.should.eql('Bazqux Co.');
                job.saveCalled.should.be.true;
                done();
            });
        });

        it('Factory(...) instead of Factory.create(...)', function(done) {
            Factory('job', function(err, job) {
                (job instanceof Job).should.be.true;
                job.title.should.eql('Engineer');
                job.company.should.eql('Foobar Inc.');
                job.saveCalled.should.be.true;
                done();
            });
        });

        it('when no model is defined then save is not supported', function(done) {
            Factory.create('appointment', function(err, appointment) {
                (err instanceof Error).should.be.true;
                err.message.should.not.be.empty;
                done();
            });
        });
    });

    describe('#object', function() {
        it('returns a literal object', function(done) {
            Factory.object('job', function(job) {
                (job instanceof Job).should.not.be.true;
                job.title.should.eql('Engineer');
                job.company.should.eql('Foobar Inc.');
                job.should.have.keys('title', 'company');
                done();
            });
        });

        it('passing attributes as second argument', function(done) {
            var newTitle = 'oliebollenkraam uitbater';
            Factory.object('job', { title: newTitle }, function(job) {
                (job instanceof Job).should.not.be.true;
                job.title.should.eql(newTitle);
                job.company.should.eql('Foobar Inc.');
                job.should.have.keys('title', 'company');
                done();
            });
        });

    });

});


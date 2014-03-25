var Factory = require('..');
var should = require('should');
var context = describe;

describe('Factory', function() {
  var Model, Person, Job;

    before(function() {
        Model = function() {};

        Model.prototype.save = function(callback) {
            this.saveCalled = true;
            callback(null, this);
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

        it('when no model is passed still returns a valid object', function(done) {
            Factory.build('appointment', function(appointment) {
                appointment.where.should.eql('Hasselt');
                appointment.when.should.eql('tomorrow');
                appointment.should.have.keys('where', 'when');
                done();
            });
        });

        describe('no callback', function() {
            it('return resolved promise with object', function(done) {
                Factory.build('appointment')
                    .then(function(appointment) {
                        appointment.where.should.eql('Hasselt');
                        appointment.when.should.eql('tomorrow');
                        appointment.should.have.keys('where', 'when');
                        done();
                    });
            });

            it('when passing attributes as second argument, return resolved promise', function(done) {
                Factory.build('appointment', { where: 'Leuven'})
                    .then(function(appointment) {
                        appointment.where.should.eql('Leuven');
                        appointment.when.should.eql('tomorrow');
                        appointment.should.have.keys('where', 'when');
                        done();
                    });
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

        describe('no callback', function() {
            it('when save is not supported return rejected promise', function(done) {
                Factory.create('appointment')
                    .then(null, function(err) {
                        (err instanceof Error).should.be.true;
                        err.message.should.not.be.empty;
                        done();
                    });
            });

            it('return resolved promise with object', function(done) {
                Factory.create('job')
                    .then(function(job) {
                        (job instanceof Job).should.be.true;
                        job.title.should.eql('Engineer');
                        job.company.should.eql('Foobar Inc.');
                        job.saveCalled.should.be.true;
                        done();
                    }, null);
            });

            it('when passing attributes as second argument return resolved promise', function(done) {
                Factory.create('job', { title: "Artist", company: "Bazqux Co." })
                .then(function(job) {
                    (job instanceof Job).should.be.true;
                    job.title.should.eql('Artist');
                    job.company.should.eql('Bazqux Co.');
                    job.saveCalled.should.be.true;
                    done();
                }, null);
            });
        });
    });


    describe('#object', function() {
        it('returns a new object', function(done) {
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

        describe('no callback', function() {
            it('return resolved promise with object', function(done) {
                Factory.object('job')
                .then(function(job) {
                    (job instanceof Job).should.not.be.true;
                    job.title.should.eql('Engineer');
                    job.company.should.eql('Foobar Inc.');
                    job.should.have.keys('title', 'company');
                    done();
                }, null);
            });

            it('when passing attributes as second argument, return resolved promise', function(done) {
                var newTitle = 'oliebollenkraam uitbater';
                Factory.object('job', { title: newTitle })
                .then(function(job) {
                    (job instanceof Job).should.not.be.true;
                    job.title.should.eql(newTitle);
                    job.company.should.eql('Foobar Inc.');
                    job.should.have.keys('title', 'company');
                    done();
                }, null);
            });
        });

    });

});

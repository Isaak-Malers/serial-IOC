var Logger = require('./logger');


var serialIOC = function() {

    // Set up logging and debugging first:
    // Log unhandled promise rejections:
    process.on('unhandledRejection', function(r) { console.log(r); });

    // Build the debugger first so it can be used everywhere else.
    this.logger = new Logger("debug");


    // Set up 'Dry-run' feature:
    this.dryRun = false;
    this.logger.log("dryRun is set to false by default", "trace");

    this.pending = new Promise(function (resolve) {
        resolve(true);
    });
    this.logger.log("pending promise built for test synchronization", "trace");
}

serialIOC.prototype.step = function (comment, functionToRun) {

    // Do some logging:
    this.logger.log("step planned: " + comment, "trace");

    // oldPending will house the previous promise
    var oldPending = this.pending;

    // Try to add the new step:
    try {
        this.pending = new Promise(function (resolve, reject) {

            // After whatever was pending finishes:
            oldPending.then(

                // If the previous step resolves:
                function () {

                    // Before doing anything, make a new logging segment:
                    this.logger.new(comment);

                    // If a function throws an exception, we need to set the object to dry run and do something else:
                    try {
                        var promiseOrNull = functionToRun();
                    } catch (e) {
                        this.logger.log("exception in step: " + comment + ", " + e, "critical");
                        this.dryRun = true;
                    }

                    // If the step is a blocking step, and returns a promise:
                    if (promiseOrNull instanceof Promise) {

                        // Pass our resolve/rejections into the returned promises.
                        promiseOrNull.then(resolve, reject);
                        this.logger.log("processing blocking step", "trace");
                    } else {
                        this.logger.log("processing non-blocking step", "trace");
                        resolve(true);
                    }

                }.bind(this), function () {

                    // If the previous promise rejects:
                    this.dryRun = true;
                    resolve(true);
                }.bind(this)
            )

        }.bind(this));
    } catch (e) {
        this.logger.log("Unable to execute step: " + comment, "critical");
        this.logger.log("cause: " + e, "critical");
        this.logger.log("test execution cannot continue:")
    }
};


serialIOC.prototype.finalize = function (callback) {

    // Once the pending promises resolve/reject:
    this.pending.then(function () {

        // If all the promises resolve, but we are in dry run mode, the test should fail.
        if (this.dryRun === true) {



            var reason = this.logger.dumpAll("critical");

            // Clean up the failure reason by removing double new-lines.
            reason = reason.replace(/^\s*\n/gm, "");

            throw reason; // TODO: Use this.fail();
            callback();
        } else {
            callback();
        }




    }.bind(this), function () {

        // If the promises reject, we can fail the test regardless of if we are in dry-run mode.
        var reason = this.logger.dumpAll("critical");

        // Clean up the failure reason by removing double new-lines.
        reason = reason.replace(/^\s*\n/gm, "");

        throw reason;
        callback();
    }.bind(this));
};


module.exports = serialIOC;
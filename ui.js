
exports.Task = extend(TolokaHandlebarsTask, function (options) {
    TolokaHandlebarsTask.call(this, options);
}, {
    validate: function(solution) {
        var isChosen = false
        for (let key in solution.output_values) {
            if (key.includes('cluster')) {
                if (typeof solution.output_values[key] == "boolean") {
                    console.log("check", key)
                    isChosen = isChosen | solution.output_values[key]
                } else {
                    isChosen = isChosen | (solution.output_values[key] == 'yes')
                }
            }
        }

        if (!isChosen) {
            return {
                task_id: this.getTask().id,
                errors: {
                    '__TASK__': {
                        message: "At least one cluster should be choosen. Answer all questions at the bottom of the task."
                    }
                }
            };
        }

        // var isIlliterate = solution.output_values['grammar'] === 'no',
        //     errorSelected = solution.output_values['stylistics'] || solution.output_values['orthography'] ||
        //         solution.output_values['punctuation'];

        // if (isIlliterate && !errorSelected) {
        //     return {
        //         task_id: this.getTask().id,
        //         errors: {
        //             '__TASK__': {
        //                 message: "Укажите тип ошибок"
        //             }
        //         }
        //     };
        // } else {
        //     return TolokaHandlebarsTask.prototype.validate.apply(this, arguments);
        // }
        return TolokaHandlebarsTask.prototype.validate.apply(this, arguments);
    },
    onRender: function() {
        // DOM-элемент задания сформирован (доступен через #getDOMElement())
        console.log("Hello, I'm inside render")
        const comment = this.getDOMElement().querySelector('.comment')
        console.log(comment.innerHTML.toString())
        console.log("I'm goint to quit render")
    },
    setSolution: function(solution) {
        {
            // Inconsistency
            var inconsistency = this.getDOMElement().querySelector('.inconsistency')

            console.log(this._task.input_values.label);

            if (this._task.input_values.label) {
                console.log("Inconsistency sample");
                inconsistency.style.display = 'block';
            }

            var true_d = inconsistency.querySelector('.true');
            true_d.style.display = solution.output_values.root === 'yes' ? 'block' : 'none';


            var false_d = inconsistency.querySelector('.false');
            false_d.style.display = solution.output_values.root === 'no' ? 'block' : 'none';

            {
                // 1
                root = true_d

                var true_d = root.querySelector('.true1');
                true_d.style.display = solution.output_values.root1 === 'yes' ? 'block' : 'none';

                var false_d = root.querySelector('.false1');
                false_d.style.display = solution.output_values.root1 === 'no' ? 'block' : 'none';
                {
                    // 10
                    root = false_d
                    var true_d = root.querySelector('.true10');
                    true_d.style.display = solution.output_values.root10 === 'yes' ? 'block' : 'none';


                    var false_d = root.querySelector('.false10');
                    false_d.style.display = solution.output_values.root10 === 'no' ? 'block' : 'none';

                    solution.output_values.cluster_7 = solution.output_values.cluster_7 == 'yes' ? true : false;
                }

            }



            var false_d = inconsistency.querySelector('.false');

            {
                // 0
                root = false_d

                var true_d = root.querySelector('.true0');
                true_d.style.display = solution.output_values.root0 === 'yes' ? 'block' : 'none';

                var false_d = root.querySelector('.false0');
                false_d.style.display = solution.output_values.root0 === 'no' ? 'block' : 'none';

            }

        }

        {
            // Consistency

            var root = this.getDOMElement()
            var consistency = root.querySelector('.consistency');


            if (!this._task.input_values.label) {
                console.log("Consistency sample");
                consistency.style.display = 'block';
            }


            root = consistency
            true_d = root.querySelector('.true');
            true_d.style.display = solution.output_values.croot === 'yes' ? 'block' : 'none';

            false_d = root.querySelector('.false');
            false_d.style.display = solution.output_values.croot == 'no' ? 'block': 'none';

            {
                // 1
                root = true_d
                var true_d = root.querySelector('.true1');
                true_d.style.display = solution.output_values.croot1 === 'yes' ? 'block' : 'none';


                {
                    // Others
                    var other = consistency.querySelector('.ccluster_3_input')
                    other.style.display = solution.output_values.ccluster_3 ? 'block' : 'none'

                    other = consistency.querySelector('.ccluster_10_input')
                    other.style.display = solution.output_values.ccluster_10 ? 'block' : 'none'

                    other = consistency.querySelector('.ccluster_17_input')
                    other.style.display = solution.output_values.ccluster_17 ? 'block' : 'none'
                }

                var false_d = root.querySelector('.false1');
                false_d.style.display = solution.output_values.croot1 === 'no' ? 'block' : 'none';


                { // 10
                    root = false_d
                    var true_d = root.querySelector('.true10');
                    true_d.style.display = solution.output_values.croot10 === 'yes' ? 'block' : 'none';

                    var false_d = root.querySelector('.false10');
                    false_d.style.display = solution.output_values.croot10 === 'no' ? 'block' : 'none';

                }

            }


            false_d = consistency.querySelector('.false');

            {
                // 0

                root = false_d
                var true_d = root.querySelector('.true0');
                true_d.style.display = solution.output_values.croot0 === 'yes' ? 'block' : 'none';

                var false_d = root.querySelector('.false0');
                false_d.style.display = solution.output_values.croot0 === 'no' ? 'block' : 'none';
            }
        }

        // // solution.output_values.cclusters = [];
        // var cclusters_out = []
        // for(const c in solution.output_values) {
        //   // console.log(c, solution.output_values[c]);
        //   if(c.startsWith('ccluster_')) {
        //     cclusters_out.push(solution.output_values[c])
        //   }
        // }
        // solution.output_values.cclusters = cclusters_out

        // var iclusters_out = []
        // for(const c in solution.output_values) {
        //   // console.log(c, solution.output_values[c]);
        //   if(c.startsWith('cluster_')) {
        //     iclusters_out.push(solution.output_values[c])
        //   }
        // }
        // solution.output_values.iclusters = iclusters_out

        console.log(solution.output_values);
        TolokaHandlebarsTask.prototype.setSolution.call(this, solution);
    },
    onDestroy: function() {
        // Задание завершено, можно освобождать (если были использованы) глобальные ресурсы
    }
});

function extend(ParentClass, constructorFunction, prototypeHash) {
    constructorFunction = constructorFunction || function () {};
    prototypeHash = prototypeHash || {};
    if (ParentClass) {
        constructorFunction.prototype = Object.create(ParentClass.prototype);
    }
    for (var i in prototypeHash) {
        constructorFunction.prototype[i] = prototypeHash[i];
    }
    return constructorFunction;
}

exports.Task = extend(TolokaHandlebarsTask, function (options) {
    TolokaHandlebarsTask.call(this, options);
}, {
    validate: function(solution) {
        var isChosen = false
        for (let key in solution.output_values) {
            if (key.includes('cluster')) {
                if (typeof solution.output_values[key] == "boolean") {
                    isChosen = isChosen | solution.output_values[key]
                } else {
                    isChosen = isChosen | (solution.output_values[key] == 'yes')
                }
            }
        }

        const sub_tree_lists = [[0, 1, 2, 3], [4, 5, 6], [7, 8, 9, 10], [11, 12, 13], [14, 15, 16, 17]]
        var choosen_sub_trees = [false, false, false, false, false]

        for (let key in solution.output_values) {
            if (key.includes('cluster')) {
                var is_true = false
                if (typeof solution.output_values[key] == "boolean") {
                    is_true = solution.output_values[key]
                } else {
                    is_true = (solution.output_values[key] == 'yes')
                }
                const cluster_num = parseInt(key.split('_')[1])
                if (is_true) {
                    for (let i = 0; i < 5; i++) {
                        if(sub_tree_lists[i].includes(cluster_num)) {
                            choosen_sub_trees[i] = true
                        }

                    }
                }
            }
        }

        var count = 0
        for (let i = 0; i < 5; i++) {
            if (choosen_sub_trees[i]) {
                count += 1
            }
        }

        if (count > 1) {
            return {
                task_id: this.getTask().id,
                errors: {
                    '__TASK__': {
                        message: "You chose checkboxes in two different question tree leaves. Please choose only one."
                    }
                }
            };
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
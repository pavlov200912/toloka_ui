
var cluster_dict = {
    'summary': {
        'change': [0, 1, 2, 3, 4],
        'keep': [5, 6, 7, 8, 29, 30],
        'other': [4, 8]
    },
    'param': {
        'change': [9, 10, 11, 12],
        'keep': [13, 14, 15],
        'other': [12, 15]
    },
    'return': {
        'change': [16, 17, 18],
        'keep': [19, 20, 21],
        'other': [18, 21]
    },
    'throws': {
        'change': [22, 23, 24, 25],
        'keep': [26, 27, 28],
        'other': [25, 28]
    }
}

exports.Task = extend(TolokaHandlebarsTask, function (options) {
    TolokaHandlebarsTask.call(this, options);
}, {
    validate: function(solution) {

        if(!solution.output_values.param || !solution.output_values.summary || !solution.output_values['return'] ||
            !solution.output_values.throws) {
            return {
                task_id: this.getTask().id,
                errors: {
                    '__TASK__': {
                        message: "You have to choose one of the options for all 4 comment parts."
                    }
                }
            };
        }

        // const sub_tree_lists = [[0, 1, 2, 3], [4, 5, 6], [7, 8, 9, 10], [11, 12, 13], [14, 15, 16, 17]]
        // var choosen_sub_trees = [false, false, false, false, false]
        // var chosen_clusters = []
        //
        // for (let key in solution.output_values) {
        //     if (key.includes('cluster')) {
        //         var is_true = false
        //         if (typeof solution.output_values[key] == "boolean") {
        //             is_true = solution.output_values[key]
        //         } else {
        //             is_true = (solution.output_values[key] === 'yes')
        //         }
        //         const cluster_num = parseInt(key.split('_')[1])
        //         if (is_true) {
        //             chosen_clusters.push(cluster_num)
        //             for (let i = 0; i < 5; i++) {
        //                 if(sub_tree_lists[i].includes(cluster_num)) {
        //                     choosen_sub_trees[i] = true
        //                 }
        //
        //             }
        //         }
        //     }
        // }
        //
        // var count = 0
        // for (let i = 0; i < 5; i++) {
        //     if (choosen_sub_trees[i]) {
        //         count += 1
        //     }
        // }
        //
        //
        // var other_empty = false
        //
        // other_empty = chosen_clusters.includes(3)
        //     && solution.output_values['ccluster_3_input'] == null
        // other_empty |= chosen_clusters.includes(10)
        //     && solution.output_values['ccluster_10_input'] == null
        // other_empty |= chosen_clusters.includes(17)
        //     && solution.output_values['ccluster_17_input'] == null
        //
        // if (other_empty) {
        //     return {
        //         task_id: this.getTask().id,
        //         errors: {
        //             '__TASK__': {
        //                 message: "You chose other cluster but didn't fill the input box. Please clarify what do you mean by other."
        //             }
        //         }
        //     };
        // }
        //
        // if (count > 1) {
        //     return {
        //         task_id: this.getTask().id,
        //         errors: {
        //             '__TASK__': {
        //                 message: "You chose checkboxes in two different question tree leaves. Please choose only one."
        //             }
        //         }
        //     };
        // }
        //
        //

        function validate_checkbox(obj, type, action) {
            var is_chosen = false
            for (let c of cluster_dict[type][action]) {
                is_chosen = is_chosen || (solution.output_values['cluster_' + c.toString()] === true)
            }
            if (!is_chosen) {
                return {
                    task_id: obj.getTask().id,
                    errors: {
                        '__TASK__': {
                            message: "You have to choose at least one checkbox in every question. But you didn't for " + type + " comment part."
                        }
                    }
                };
            }
            return null
        }

        const comment_types = ['summary', 'return', 'throws', 'param']
        for (let type of comment_types) {
            if (solution.output_values[type] === 'change') {
                const err = validate_checkbox(this, type, 'change')
                if (err != null) {
                    return err
                }
            }
            if (solution.output_values[type] === 'keep') {
                const err = validate_checkbox(this, type, 'keep')
                if (err != null) {
                    return err
                }
            }
        }


        for (let type of comment_types) {
            for (let c of cluster_dict[type]['other']) {
                if (solution.output_values['cluster_' + c.toString()]) {
                    if (solution.output_values['cluster_' + c.toString() + '_input'] === '' || solution.output_values['cluster_' + c.toString() + '_input'] == null) {
                        // console.log('val', solution.output_values['cluster_' + c.toString() + '_input'])
                        return {
                            task_id: this.getTask().id,
                            errors: {
                                '__TASK__': {
                                    message: "You have to write something in the 'other' input field. But you didn't for " + type + " comment part."
                                }
                            }
                        };
                    }
                }
            }
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
        const type_from_input = this.getDOMElement().querySelector('.type').innerHTML.toString()
        // const comment_types = ['summary', 'return', 'throws', 'param']
        const comment_types = [type_from_input]

        for (let type of comment_types) {
            var root = this.getDOMElement().querySelector('.' + type)
            if ((!root) || !('style' in root)) {
                console.log("Early exit")
                TolokaHandlebarsTask.prototype.setSolution.call(this, solution);
                return
            }
            root.style.display = 'block'


            var root = this.getDOMElement().querySelector('.' + type + '-change')
            if ((!root) || !('style' in root)) {
                console.log("Early exit")
                TolokaHandlebarsTask.prototype.setSolution.call(this, solution);
                return
            }
            root.style.display = solution.output_values[type] === 'change' ? 'block' : 'none'
            root = this.getDOMElement().querySelector('.' + type + '-keep')
            root.style.display = solution.output_values[type] === 'keep' ? 'block' : 'none'

        }


        // show others
        for (let type of comment_types) {
            for (let c of cluster_dict[type]['other']) {
                console.log()
                var other =  this.getDOMElement().querySelector('.cluster_' + c.toString() + '_input')
                other.style.display = solution.output_values['cluster_' + c.toString()] ? 'block' : 'none'
            }
        }

        // clear other subtrees
        function clear(type, action) {
            for(let c of cluster_dict[type][action]) {
                solution.output_values['cluster_' + c.toString()] = false
            }
        }

        for (let type of comment_types) {
            if (solution.output_values[type] === 'change') {
                clear(type, 'keep')
            }
            if (solution.output_values[type] === 'keep') {
                clear(type, 'change')
            }
            if (solution.output_values[type] === 'absent') {
                clear(type, 'change')
                clear(type, 'keep')
            }
        }


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
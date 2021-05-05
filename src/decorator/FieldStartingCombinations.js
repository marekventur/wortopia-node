
import _ from "underscore";

export default function(field) {
    var size = field.length;

    field.getAllStartingCombinations = function() {
        // Find all two-letter combinations
        var twoLetterStartings = [];
        for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
                var c1 = field[y][x];
                if (x > 0) {
                    twoLetterStartings.push(c1 + field[y][x - 1]);
                    if (y > 0) {
                        twoLetterStartings.push(c1 + field[y - 1][x - 1]);
                    }
                    if (y < size - 1) {
                        twoLetterStartings.push(c1 + field[y + 1][x - 1]);
                    }
                }
                if (x < size - 1) {
                    twoLetterStartings.push(c1 + field[y][x + 1]);
                    if (y > 0) {
                        twoLetterStartings.push(c1 + field[y - 1][x + 1]);
                    }
                    if (y < size - 1) {
                        twoLetterStartings.push(c1 + field[y + 1][x + 1]);
                    }
                }
                if (y > 0) {
                    twoLetterStartings.push(c1 + field[y - 1][x]);
                }
                if (y < size - 1) {
                    twoLetterStartings.push(c1 + field[y + 1][x]);
                }
            }
        }
        return _.uniq(twoLetterStartings);
    }

}
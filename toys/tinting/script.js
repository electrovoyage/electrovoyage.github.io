function calculateOne(orig, tgt) {
    return (tgt / orig) * 255
}

window.onload = () => {
    document.querySelector('.calculate_btn').addEventListener('click', () => {
        const tintable_color = document.querySelector('.tintable_color').value
        const desired_color = document.querySelector('.target_color').value

        const tintable_components = tintable_color.split(' ').map((currentValue, index, array) => {
            return parseFloat(currentValue)
        })
        const desired_components = desired_color.split(' ').map((currentValue, index, array) => {
            return parseFloat(currentValue)
        })
        let calculated_components = []

        for (let i = 0; i < 3; i++) {
            let orig = tintable_components[i]
            let tgt = desired_components[i]
            let calc = calculateOne(orig, tgt)
            let rounded = Math.round(calc)
            calculated_components.push(rounded.toFixed(0))
        }

        let calculated_color = calculated_components.join(' ')
        document.querySelector('.result_display').innerHTML = calculated_color
    })
}
//   137 137 137
// * 68 101 115
// = 127 188 214
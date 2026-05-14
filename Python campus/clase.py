def leerDatos(totalNotas, tipoEva):
    notaAcum = 0
    for i in range (totalNotas):
        while(True):
            nota = int (input(f'ingrese nota de {tipoEva} : [{i+1}] :'))
            if ((nota>=0)and (nota<=100)):
                notaAcum += nota
                break
            else:
                print('la nota es invalida, recuerde que debe estar entre 0 y 100')
    return notaAcum

EVALUACIONES = 3
QUICES = 4
TRABAJOS = 2
notaFinal = 0
notaEvaluaciones = 0
notaQuices = 0
notaTrabajos = 0
notaEvaluaciones = leerDatos (EVALUACIONES, 'parciales')
notaQuices = leerDatos(QUICES, 'Quices')
notaTrabajos = leerDatos (TRABAJOS, 'trabajos')



notaFinal = ((notaEvaluaciones/EVALUACIONES)*0.6) + ((notaQuices/QUICES)*0.25) + ((notaTrabajos/TRABAJOS)*0.15)
print (f'La nota final es {notaFinal}')




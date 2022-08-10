from random import *
from unittest import case

# randomly trims a char
def trimChar(input):
    i = randint(0, len(input)-1)
    char = input[i]
    return input.replace(char, '', 1)

# randomly swaps two chars
def swapChars(input):
    if (len(input) == 1):
        return input
    i = randint(0, len(input)-1)
    j = randint(0, len(input)-1)
    while(i == j):
        j = randint(0, len(input)-1)
    lst = list(input)
    lst[i], lst[j] = lst[j], lst[i]
    return ''.join(lst)

# randomly inserts a char
def insertChar(input):
    i = randint(0, len(input)-1)
    char = chr(randint(0,127))
    return input[:i+1] + char + input[i+1:]


def fuzz_generator(input):
    case = randint(1,3)
    if case == 1:
        return(trimChar(input))
    elif case == 2:
        return(swapChars(input))
    elif case == 3:
        return(insertChar(input))
        






    








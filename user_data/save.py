
from string import printable

chars = printable
i = chars.find
ln = len(chars)

def make_eq(l: str, m: str):
    '''Returns a tuple of two strings of equal lengths.'''
    small, big = (l,m) if len(l) < len(m) else(m,l)
    small *= (a:=len(big)) // (b:=len(small))
    small += ''.join(small[i] for i in range(a%b))
    return (small,big) if small == l else (big,small)


def vigenere(text: str, key: str):
    '''Return the supplied text vigenere ciphered with the supplied key'''
    text, key = make_eq(text, key)
    return ''.join((chars[i(t) + (i(k) - ln)] if t in chars else t) for t,k in zip(text,key))


def devigenere(text: str, key: str):
    '''Return the encrypted text unciphered via the used key'''
    text, key = make_eq(text, key)
    return ''.join((chars[i(t) - (i(k) - ln)] if t in chars else t) for t,k in zip(text,key))



from csv import reader, writer

def log(room, data):
    try:
        with open('msgs.csv', 'a') as msgs:   
            _csv = writer(msgs)
            _csv.writerow([room, data])
            
        return True
    except:   
        return False


def view(room):
    with open('msgs.csv') as msgs:
        _csv = reader(msgs)
        return [i[1] for i in _csv if i[0] == room]



__all__ = ['vigenere', 'devigenere', 'log', 'view']
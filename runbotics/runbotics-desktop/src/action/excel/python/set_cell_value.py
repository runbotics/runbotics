from RPA.Excel.Files import Files
import sys

def set_cell_value(path, row, column, value):
    print(path, row, column, value)
    if not path:
        raise ValueError("Path cannot be empty")
    if not row:
        raise ValueError("Row cannot be empty")
    if not column:
        raise ValueError("Column cannot be empty")
    if not value:
        raise ValueError("Value cannot be empty")

    lib = Files()
    lib.open_workbook(path)
    try:
        lib.set_cell_value(row, column, value)
        lib.save_workbook()
    finally:
        lib.close_workbook()

def main():
    if(len(sys.argv) != 5):
        raise ValueError("Invalid number of arguments")
    else:
        set_cell_value(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])

main()
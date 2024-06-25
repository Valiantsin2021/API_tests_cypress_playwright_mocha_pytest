import time
import subprocess
start = time.time()

subprocess.run(["pytest", "pytest/tests/test_user_crud.py", "pytest/tests/test_contacts_crud.py"])

end = time.time()

print(round(end - start, 2), 'seconds')
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Checkbox } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface SubDepartment {
  name: string;
  selected: boolean;
}

interface Department {
  department: string;
  sub_departments: SubDepartment[];
  expanded: boolean;
  selected: boolean;
}

const SecondPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Post[]>([]);
  const [jsonData, setJsonData] = useState<Department[]>([]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
      alert('Please enter your details before accessing this page.');
    } else {
      fetchData();
      setJsonData([
        {
          department: 'Agriculture & Fishing',
          sub_departments: [
            { name: 'Agriculture', selected: false },
            { name: 'Crops', selected: false },
            { name: 'Farming Animals & Livestock', selected: false },
            { name: 'Fishery & Aquaculture', selected: false },
            { name: 'Ranching', selected: false },
          ],
          expanded: false,
          selected: false,
        },
        {
          department: 'Business Services',
          sub_departments: [
            { name: 'Accounting & Accounting Services', selected: false },
            { name: 'Auctions', selected: false },
            { name: 'Business Services - General', selected: false },
            { name: 'Call Centers & Business Centers', selected: false },
            { name: 'Career Planning', selected: false },
            { name: 'Career', selected: false },
            { name: 'Commercial Printing', selected: false },
            { name: 'Debt Collection', selected: false },
          ],
          expanded: false,
          selected: false,
        },
      ]);
    }
  }, [navigate]);

  const fetchData = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const result = await response.json();
    setData(result);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'body', headerName: 'Body', width: 200 },
  ];

  const handleDepartmentClick = (index: number) => {
    setJsonData((prevData) =>
      prevData.map((dept, i) =>
        i === index ? { ...dept, expanded: !dept.expanded } : dept
      )
    );
  };

  const handleSubDepartmentClick = (deptIndex: number, subDeptIndex: number) => {
    setJsonData((prevData) => {
      const newDept = { ...prevData[deptIndex] };
      newDept.sub_departments[subDeptIndex].selected = !newDept.sub_departments[subDeptIndex].selected;
      newDept.selected = newDept.sub_departments.every((subDept) => subDept.selected);
      return prevData.map((dept, i) => (i === deptIndex ? newDept : dept));
    });
  };

  const handleDepartmentSelect = (index: number) => {
    setJsonData((prevData) => {
      const newDept = { ...prevData[index] };
      newDept.selected = !newDept.selected;
      newDept.sub_departments = newDept.sub_departments.map((subDept) => ({
        ...subDept,
        selected: newDept.selected,
      }));
      return prevData.map((dept, i) => (i === index ? newDept : dept));
    });
  };

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4">Data Table</Typography>
        <div style={{ height: 400, width: '100%' }}>
          {/* <DataGrid rows={data} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
           */}

<DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
        </div>

        <Typography variant="h4" mt={5}>
          Departments
        </Typography>
        {jsonData.map((dept, index) => (
          <Box key={index} mt={2}>
            <Button onClick={() => handleDepartmentClick(index)}>
              {dept.department} {dept.expanded ? '-' : '+'}
            </Button>
            {dept.expanded &&
              dept.sub_departments.map((subDept, subIndex) => (
                <Box key={subIndex} ml={4}>
                  <Checkbox
                    checked={subDept.selected}
                    onChange={() => handleSubDepartmentClick(index, subIndex)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                  <Typography variant="body1">{subDept.name}</Typography>
                </Box>
              ))}
            <Checkbox
              checked={dept.selected}
              onChange={() => handleDepartmentSelect(index)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <Typography variant="body1">Select All</Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default SecondPage;
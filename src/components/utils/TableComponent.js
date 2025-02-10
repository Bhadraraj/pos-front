import React, { useState } from 'react';
import { Table, Pagination, PaginationItem, PaginationLink, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap';

const TableComponent = ({ headers, data, renderActions, itemsPerPage = 5, loading }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const toggleModal = () => setModal(!modal);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);

    // Change page
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Edit action logic
    const handleEdit = (item) => {
        setCurrentItem(item);
        toggleModal(); // Open the modal
    };

    // Delete action logic
    const handleDelete = (itemId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            console.log('Deleted item:', itemId);
        }
    };

    return (
        <div>
            <Table responsive>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={headers.length + 1} className="text-center">Loading...</td>
                        </tr>
                    ) : currentData.length > 0 ? (
                        currentData.map((item, index) => (
                            <tr key={index}>
                                {headers.map((header, idx) => (
                                    <td key={idx}>{item[header]}</td>
                                ))}
                                <td>
                                    <Button color="primary" onClick={() => handleEdit(item)}>Edit</Button>{' '}
                                    <Button color="danger" onClick={() => handleDelete(item.categoryId)}>Delete</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={headers.length + 1}>No data available</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center">
                    <Pagination>
                        <PaginationItem disabled={currentPage === 1}>
                            <PaginationLink
                                previous
                                onClick={() => handlePageChange(currentPage - 1)}
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index} active={currentPage === index + 1}>
                                <PaginationLink onClick={() => handlePageChange(index + 1)}>
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem disabled={currentPage === totalPages}>
                            <PaginationLink
                                next
                                onClick={() => handlePageChange(currentPage + 1)}
                            />
                        </PaginationItem>
                    </Pagination>
                </div>
            )}

            {/* Edit Modal */}
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Edit Category</ModalHeader>
                <ModalBody>
                    {currentItem && (
                        <div>
                            <FormGroup>
                                <Label for="categoryName">Category Name</Label>
                                <Input
                                    id="categoryName"
                                    type="text"
                                    value={currentItem.categoryName}
                                    onChange={(e) =>
                                        setCurrentItem({ ...currentItem, categoryName: e.target.value })
                                    }
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input
                                    id="description"
                                    type="text"
                                    value={currentItem.description}
                                    onChange={(e) =>
                                        setCurrentItem({ ...currentItem, description: e.target.value })
                                    }
                                />
                            </FormGroup>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleModal}>
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => {
                            console.log('Updated item:', currentItem);
                            toggleModal();
                        }}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default TableComponent;

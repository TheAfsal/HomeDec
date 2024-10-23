import * as React from "react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ChevronDownIcon, EllipsisVertical, PackagePlus, ChevronsUpDown, Rss, ShieldBan } from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TailSpin } from "react-loader-spinner"
import { changeProductStatus, ListAllProducts, ListProducts } from '../../../../api/administrator/productManagement'
import { MANAGEMENT_ROUTES } from '../../../../config/routerConstants'
import IsSeller from '../../../../components/Admin/IsSeller'
import { useConfirmation } from "@/context/ConfirmationContext"
import AddNewProduct from "./AddNewProduct"


const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [addPopUp, setAddPopUp] = useState(false)
  const navigate = useNavigate()
  const { role } = useSelector(state => state.auth)
  const requestConfirmation = useConfirmation();


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const list = role === "seller" ? await ListProducts() : await ListAllProducts(role)
        console.log(list)
        setProducts(list)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProduct()
  }, [role])

  const EditProductStatus = async (pId, index) => {
    try {
      const response = await changeProductStatus({ pId, index })
      if (response.status === 200) {
        const updatedVariant = response.variant

        setProducts((prevProducts) =>
          prevProducts.map((prod) => {
            if (prod._id === pId) {
              const updatedVariants = [...prod.variants]
              updatedVariants[index] = updatedVariant
              return { ...prod, variants: updatedVariants }
            }
            return prod
          })
        )

        console.log(response.message)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const columns = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Name
            <ChevronsUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <div>{`${row.original.category} / ${row.original.subCategory}`}</div>,
    },
    {
      accessorKey: "colors",
      header: "Available Colors",
      cell: ({ row }) => (
        <div className="flex flex-col gap-4">
          {row.original.variants.map((variant, index) => (
            <div
              key={index}
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: variant.colorHex }}
            ></div>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "stocks",
      header: "Stocks",
      cell: ({ row }) => (
        <div className="flex flex-col gap-4">
          {row.original.variants.map((variant, index) => (
            <div key={index}>{variant.stock}</div>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="flex flex-col gap-4">
          {row.original.variants.map((variant, index) => (
            <div key={index}>₹ {variant.price}</div>
          ))}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original
        return (
          <>
            {
              product.variants.some((variant) => variant.images[0].secure_url === "pending")
                ? <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <TailSpin
                        visible={true}
                        height="30"
                        width="30"
                        color="#4a7975"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      We will notify you once the processing is complete
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                : <div className="flex items-center gap-4">
                  {role !== "admin" && (
                    <div>
                      {product.variants.map((variant, index) => (
                        <div key={index} className="mt-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => {
                                    requestConfirmation(`Are you sure you want to ${variant.isActive ? "unlist" : "list"} this variant`, () => {
                                      EditProductStatus(product._id, index)
                                    });
                                  }}
                                  className={`${!variant.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    } hover:bg-gray-200 rounded-full w-8 h-8`}
                                >
                                  {variant.isActive ? <ShieldBan size={16} /> : <Rss size={16} />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {variant.isActive ? "Disable Product" : "Go Live"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ))}
                    </div>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product._id)}>
                        Copy product ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate(`/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.PRODUCTS}/${MANAGEMENT_ROUTES.PRODUCTS_EDIT}/${product._id}`)}>
                        Edit product
                      </DropdownMenuItem>
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Update inventory</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            }
          </>
        )
      },
    },
  ]

  const table = useReactTable({
    data: products,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between mb-3">
        <h2 className="text-2xl font-bold font-nunito">Product Details</h2>
        <IsSeller>
          <Button
            onClick={() => setAddPopUp(true)}
            className="bg-green-600 hover:bg-green-700 text-white "
          >
            <PackagePlus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
          {
            addPopUp && <AddNewProduct isOpen={addPopUp} onClose={setAddPopUp} />
          }

        </IsSeller>
      </div>
      <hr />
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter products..."
          value={(table.getColumn("title")?.getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
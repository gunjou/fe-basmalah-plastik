/* Total Keuntungan & Ringkasan */}
            <div className="mt-3 flex justify-end">
              <table className="w-auto text-sm text-left font-bold text-[#1E686D]">
                <tbody>
                  <tr>
                    <td className="pr-4">Total Jenis Produk Terjual</td>
                    <td>: </td>
                    <td>
                      {sortedData.length === 0 ? (
                        <span className="text-red-600 font-bold">-</span>
                      ) : (
                        sortedData.length
                      )}{" "}
                      Produk
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4">Total Banyak Produk Terjual</td>
                    <td>: </td>
                    <td>
                      {sortedData.reduce(
                        (acc, item) => acc + (Number(item.total_qty) || 0),
                        0
                      ) === 0 ? (
                        <span className="text-red-600 font-bold">-</span>
                      ) : (
                        sortedData.reduce(
                          (acc, item) => acc + (Number(item.total_qty) || 0),
                          0
                        )
                      )}{" "}
                      Produk
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4">Total Keuntungan</td>
                    <td>: </td>
                    <td>
                      {sortedData.reduce(
                        (acc, item) => acc + (Number(item.keuntungan) || 0),
                        0
                      ) === 0 ? (
                        <span className="text-red-600 font-bold">-</span>
                      ) : (
                        "Rp. " +
                        sortedData
                          .reduce(
                            (acc, item) => acc + (Number(item.keuntungan) || 0),
                            0
                          )
                          .toLocaleString("id-ID")
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
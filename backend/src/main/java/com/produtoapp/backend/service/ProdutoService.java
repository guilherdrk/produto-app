package com.produtoapp.backend.service;

import com.produtoapp.backend.dto.ProdutoRequestDTO;
import com.produtoapp.backend.dto.ProdutoResponseDTO;
import com.produtoapp.backend.domain.entity.Produto;
import com.produtoapp.backend.domain.repository.ProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public List<ProdutoResponseDTO> listarTodos() {
        return produtoRepository.findByAtivoTrue()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public ProdutoResponseDTO buscarPorId(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado com id: " + id));
        return toResponseDTO(produto);
    }

    @Transactional
    public ProdutoResponseDTO criar(ProdutoRequestDTO dto) {
        Produto produto = Produto.builder()
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .preco(dto.getPreco())
                .estoque(dto.getEstoque())
                .ativo(true)
                .build();
        return toResponseDTO(produtoRepository.save(produto));
    }

    @Transactional
    public ProdutoResponseDTO atualizar(Long id, ProdutoRequestDTO dto) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado com id: " + id));

        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setEstoque(dto.getEstoque());

        return toResponseDTO(produtoRepository.save(produto));
    }

    @Transactional
    public void deletar(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado com id: " + id));
        // Soft delete: não remove do banco, apenas desativa
        produto.setAtivo(false);
        produtoRepository.save(produto);
    }

    private ProdutoResponseDTO toResponseDTO(Produto produto) {
        return ProdutoResponseDTO.builder()
                .id(produto.getId())
                .nome(produto.getNome())
                .descricao(produto.getDescricao())
                .preco(produto.getPreco())
                .estoque(produto.getEstoque())
                .ativo(produto.getAtivo())
                .criadoEm(produto.getCriadoEm())
                .atualizadoEm(produto.getAtualizadoEm())
                .build();
    }
}